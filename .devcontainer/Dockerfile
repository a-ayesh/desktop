FROM node:24-bookworm-slim

# CLI tooling used by shell setup (common-utils also ensures git exists).
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        openssh-client \
        fzf \
        zsh-autosuggestions \
        zsh-syntax-highlighting \
    && rm -rf /var/lib/apt/lists/*

# Enable pnpm shim as root; `corepack enable` writes under /usr/local/bin (fails as remoteUser `node`).
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm
