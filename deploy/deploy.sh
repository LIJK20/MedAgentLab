#!/usr/bin/env bash
# ------------------------------------------------------------------
# MedAgentLab — one-shot deploy to an Ubuntu + Nginx host.
#
# Run on the *server* after you have rsynced the repo there, OR run
# locally if your dev machine has SSH access (uses rsync over ssh).
#
# Usage (local → remote):
#   REMOTE=user@1.2.3.4 ./deploy/deploy.sh
#
# Usage (on the server, after `git pull`):
#   sudo ./deploy/deploy.sh local
# ------------------------------------------------------------------
set -euo pipefail

MODE="${1:-remote}"
REMOTE="${REMOTE:-}"
TARGET_DIR="/var/www/medagentlab"
NGINX_CONF_SRC="deploy/nginx-medagentlab.conf"
NGINX_CONF_DST="/etc/nginx/sites-available/medagentlab"

c_blue='\033[1;34m'; c_grn='\033[1;32m'; c_red='\033[1;31m'; c_off='\033[0m'
log() { printf "${c_blue}▸${c_off} %s\n" "$*"; }
ok()  { printf "${c_grn}✓${c_off} %s\n" "$*"; }
die() { printf "${c_red}✗ %s${c_off}\n" "$*" >&2; exit 1; }

# 1. Build -----------------------------------------------------------
log "Installing dependencies"
npm ci

log "Building production bundle"
npm run build
[[ -d dist ]] || die "dist/ not produced — build failed."
ok  "Build artifact at ./dist"

# 2. Ship ------------------------------------------------------------
if [[ "$MODE" == "local" ]]; then
  log "Local install → ${TARGET_DIR}"
  sudo mkdir -p "$TARGET_DIR"
  sudo rsync -a --delete dist/ "$TARGET_DIR/"
  sudo chown -R www-data:www-data "$TARGET_DIR"

  if [[ ! -f "$NGINX_CONF_DST" ]]; then
    log "Installing Nginx site"
    sudo cp "$NGINX_CONF_SRC" "$NGINX_CONF_DST"
    sudo ln -sfn "$NGINX_CONF_DST" /etc/nginx/sites-enabled/medagentlab
  fi

  log "Validating & reloading Nginx"
  sudo nginx -t
  sudo systemctl reload nginx
  ok "Site live at http://$(hostname -I | awk '{print $1}')/"
  exit 0
fi

# Remote mode -------------------------------------------------------
[[ -n "$REMOTE" ]] || die "Set REMOTE=user@host for remote deploy."

log "Syncing dist/ to ${REMOTE}:${TARGET_DIR}"
rsync -az --delete \
      -e "ssh -o StrictHostKeyChecking=accept-new" \
      dist/ "$REMOTE:/tmp/medagentlab-dist/"

log "Syncing nginx config"
rsync -az "$NGINX_CONF_SRC" "$REMOTE:/tmp/nginx-medagentlab.conf"

log "Installing on remote"
ssh "$REMOTE" "bash -se" <<EOSSH
set -euo pipefail
sudo mkdir -p ${TARGET_DIR}
sudo rsync -a --delete /tmp/medagentlab-dist/ ${TARGET_DIR}/
sudo chown -R www-data:www-data ${TARGET_DIR}

if [[ ! -f ${NGINX_CONF_DST} ]]; then
  sudo mv /tmp/nginx-medagentlab.conf ${NGINX_CONF_DST}
  sudo ln -sfn ${NGINX_CONF_DST} /etc/nginx/sites-enabled/medagentlab
fi
sudo nginx -t
sudo systemctl reload nginx
EOSSH

ok "Remote deploy complete → http://${REMOTE#*@}/"
