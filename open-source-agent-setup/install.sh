#!/usr/bin/env bash
set -euo pipefail

SKILL_NAME="jobhunt-ready-refresh"
REPO_URL="${JOBHUNT_REPO_URL:-https://github.com/DevOpsAIguru123/job-hunt}"
REF="${JOBHUNT_REF:-main}"

INSTALL_CODEX=1
INSTALL_CLAUDE=1
DRY_RUN=0
YES=0

usage() {
  cat <<'USAGE'
Job Hunt agent skill installer

Usage:
  bash install.sh [options]

Options:
  --yes           Install without prompting.
  --dry-run       Print actions without writing files.
  --codex-only    Install only for Codex.
  --claude-only   Install only for Claude Code.
  --help          Show this help.

Environment:
  JOBHUNT_REPO_URL  Repository URL used when the skill is not available locally.
  JOBHUNT_REF       Git ref used for remote tarball installs. Default: main.
USAGE
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --yes|-y)
      YES=1
      ;;
    --dry-run)
      DRY_RUN=1
      YES=1
      ;;
    --codex-only)
      INSTALL_CODEX=1
      INSTALL_CLAUDE=0
      ;;
    --claude-only)
      INSTALL_CODEX=0
      INSTALL_CLAUDE=1
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_ROOT="$SCRIPT_DIR"
TMP_DIR=""

cleanup() {
  if [ -n "$TMP_DIR" ] && [ -d "$TMP_DIR" ]; then
    rm -rf "$TMP_DIR"
  fi
}
trap cleanup EXIT

find_skill_source() {
  local local_source="$PACKAGE_ROOT/skills/$SKILL_NAME"
  if [ -f "$local_source/SKILL.md" ]; then
    printf '%s\n' "$local_source"
    return 0
  fi

  if ! command -v curl >/dev/null 2>&1 || ! command -v tar >/dev/null 2>&1; then
    echo "Local skill files were not found, and curl/tar are required for remote install." >&2
    return 1
  fi

  TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/jobhunt-install.XXXXXX")"
  local archive="$TMP_DIR/source.tar.gz"
  local tarball="$REPO_URL/archive/refs/heads/$REF.tar.gz"

  echo "Downloading $REPO_URL@$REF..." >&2
  curl -fsSL "$tarball" -o "$archive"
  tar -xzf "$archive" -C "$TMP_DIR"

  local extracted
  extracted="$(find "$TMP_DIR" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
  local remote_source="$extracted/open-source-agent-setup/skills/$SKILL_NAME"
  if [ ! -f "$remote_source/SKILL.md" ]; then
    echo "Skill not found in downloaded archive: open-source-agent-setup/skills/$SKILL_NAME" >&2
    return 1
  fi

  printf '%s\n' "$remote_source"
}

copy_skill() {
  local source_dir="$1"
  local target_dir="$2"

  if [ "$DRY_RUN" -eq 1 ]; then
    echo "Would install $SKILL_NAME -> $target_dir"
    return 0
  fi

  mkdir -p "$(dirname "$target_dir")"
  rm -rf "$target_dir"
  mkdir -p "$target_dir"

  cp -R "$source_dir/." "$target_dir/"
  echo "Installed $SKILL_NAME -> $target_dir"
}

if [ "$INSTALL_CODEX" -eq 0 ] && [ "$INSTALL_CLAUDE" -eq 0 ]; then
  echo "Nothing selected to install." >&2
  exit 2
fi

CODEX_TARGET="$HOME/.codex/skills/$SKILL_NAME"
CLAUDE_TARGET="$HOME/.claude/skills/$SKILL_NAME"

echo "Job Hunt agent skill setup"
if [ "$INSTALL_CODEX" -eq 1 ]; then
  echo "Codex target: $CODEX_TARGET"
fi
if [ "$INSTALL_CLAUDE" -eq 1 ]; then
  echo "Claude Code target: $CLAUDE_TARGET"
fi

if [ "$YES" -ne 1 ]; then
  printf 'Install now? [y/N] '
  read -r answer
  case "$answer" in
    y|Y|yes|YES)
      ;;
    *)
      echo "Cancelled."
      exit 0
      ;;
  esac
fi

SOURCE_DIR="$(find_skill_source)"

if [ "$INSTALL_CODEX" -eq 1 ]; then
  copy_skill "$SOURCE_DIR" "$CODEX_TARGET"
fi
if [ "$INSTALL_CLAUDE" -eq 1 ]; then
  copy_skill "$SOURCE_DIR" "$CLAUDE_TARGET"
fi

echo "Done."
