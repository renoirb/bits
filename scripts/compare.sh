#!/usr/bin/env bash

set -ue

source "${PWD}/scripts/_common.sh"

printf "\nComparing with remote Bit scope for:\n"
echo ${BIT_LOCAL_PROJECTS} | tr ' ' "\n"
printf "\n"

for bitIdentifier in ${BIT_LOCAL_PROJECTS}; do
    bit show $bitIdentifier --compare
    printf "\n"
    read -n 1 -s -r -p "Press any key to continue"
done
