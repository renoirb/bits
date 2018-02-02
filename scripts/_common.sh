
must_command_exist()
{
    command -v "${1}" >/dev/null 2>&1 || { echo >&2 "Command ${1} must exist."; exit 1; }
}

must_command_exist jq
must_command_exist bit

STARTSWITH=${BIT_NAMESPACE_USER:-renoirb}
BIT_LOCAL_PROJECTS=$(bit list -j | jq -r --arg s ${STARTSWITH} '.[].id | select(startswith($s))')
