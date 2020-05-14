#!/usr/bin/env bash

set -e

source scripts/hooks/utils/exit-on-ci.sh
source scripts/hooks/utils/common.sh

changed_files="$(get_changed_files HEAD@{1} HEAD)"

check_deps
