#!/usr/bin/env bash
set -euo pipefail

# postCreateCommand runs as remoteUser (`node`), not root—do not use `corepack enable` here (EACCES on /usr/local/bin).
ZSHRC="/home/node/.zshrc"

# Starship: https://starship.rs/guide/#step-1-install-starship
curl -sS https://starship.rs/install.sh | sh -s -- -y

if [[ ! -f "${ZSHRC}" ]]; then
  echo "Expected ${ZSHRC} from common-utils; skipping shell hooks." >&2
  exit 0
fi

# Oh My Zsh theme must be empty when using Starship: https://starship.rs/guide/#oh-my-zsh
if grep -qE '^ZSH_THEME=' "${ZSHRC}"; then
  sed -i.bak 's/^ZSH_THEME=.*/ZSH_THEME=""/' "${ZSHRC}"
else
  printf '\nZSH_THEME=""\n' >> "${ZSHRC}"
fi

MARKER="# devcontainer shell extras"
if grep -qF "${MARKER}" "${ZSHRC}"; then
  exit 0
fi

cat >> "${ZSHRC}" <<'EOF'

# devcontainer shell extras
[ -f /usr/share/doc/fzf/examples/key-bindings.zsh ] && source /usr/share/doc/fzf/examples/key-bindings.zsh
[ -f /usr/share/doc/fzf/examples/completion.zsh ] && source /usr/share/doc/fzf/examples/completion.zsh
eval "$(starship init zsh)"
source /usr/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /usr/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
EOF
