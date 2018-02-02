#!/usr/bin/env bash

# Run tests on all components
# This is a shim for https://github.com/teambit/bit/issues/704

set -ue

must_command_exist()
{
    command -v "${1}" >/dev/null 2>&1 || { echo >&2 "Command ${1} must exist."; exit 1; }
}

must_command_exist jq
must_command_exist bit

STARTSWITH=${BIT_NAMESPACE_USER:-renoirb}

printf "\nRun tests for:\n"
bit list -j | jq --arg s ${STARTSWITH} '.[].id | select(startswith($s))'
printf "\n"

bit list -j | jq -r --arg s ${STARTSWITH} '.[].id | select(startswith($s))' | while read -r line; do eval "bit test $line"; done

