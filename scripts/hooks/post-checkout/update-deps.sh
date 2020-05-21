#!/usr/bin/env bash

set -e

source scripts/hooks/utils/exit-on-ci.sh
source scripts/hooks/utils/common.sh
source scripts/hooks/post-checkout/init.sh

if [[ $checkoutType = 'branch' ]]; then
  changed_files="$(get_changed_files $prevHEAD $newHEAD)"

  check_deps
fi
