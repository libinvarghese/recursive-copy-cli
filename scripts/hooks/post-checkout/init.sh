#!/usr/bin/env bash

set -e

if [[ -z $HUSKY_GIT_PARAMS ]]; then
  prevHEAD=$1
  newHEAD=$2
  checkoutType=$3
else
  params=($HUSKY_GIT_PARAMS)
  prevHEAD=${params[0]}
  newHEAD=${params[1]}
  checkoutType=${params[2]}
fi

[[ $checkoutType == 1 ]] && checkoutType='branch' ||
  checkoutType='file'
