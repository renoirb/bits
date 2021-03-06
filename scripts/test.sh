#!/usr/bin/env bash

# Run tests on all components
# This is a shim for https://github.com/teambit/bit/issues/704

set -ue

source "${PWD}/scripts/_common.sh"

printf "\nRun tests for:\n"
echo ${BIT_LOCAL_PROJECTS} | tr ' ' "\n"
printf "\n"

for bitIdentifier in ${BIT_LOCAL_PROJECTS}; do
    bit test $bitIdentifier
    printf "\n"
done
