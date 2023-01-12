# react-state-atom

`react-state-atom` is a global state management solution for React + TypeScript

## Pros and cons of react-state-atom

### Pros

- Provider-free
- Hook-based
- Tiny (985 bytes pre-optimization)
- TypeScript-first
- Test-friendly
- Non-extensible API - no rabbit holes

### Cons

- Lower hypothetical performance ceiling than recursive-proxy-based solutions like Valtio or Mobx
- No support for Redux devtools

## API

### createAtom<T>(base: T): Atom<T>

Creates a global state atom.

### Atom.get(): T

Returns the current value of the atom.

### Atom.reset(): void

Resets the value of the atom to `base` (the original value passed to `createAtom`). Triggers updates in hooks and subscribers.

### Atom.set(value: T): void

Sets the value of the atom. Triggers updates in hooks and subscribers.

### Atom.subscribe(cb: (state: T, prev: T) => void): () => void

Subscribes a callback to an atom. The callback is called every time the value of the atom changes. Returns an `unsubscribe` function that terminates the subscription.

### Atom.use(): T

Use the atom as a hook. Returns the value of the atom. The value is updated every time the value of the atom changes.

### resetAtoms(): void

Resets the state of all atoms that have been created. Triggers updates in hooks and subscribers. (Useful for testing and refresh-free logouts.)

## Example

```tsx
import { createAtom } from 'react-state-atom'

const usersAtom = createAtom<User[]>([])
const selectedIdAtom = createAtom<number | null>(null)

async function reloadUsers() {
  usersAtom.reset() // note
  const users = (await axios.get('/users')).data as User
  users.set(users) // note
}

async function createUser(params: UserParams) {
  const user = await axios.post('/user', params).data as User
  usersAtom.set([...usersAtom.get(), user]) // note
}

function useSelectedUser() {
  const users = usersAtom.use() // note
  const userId = selectedIdAtom.use() // note

  return React.useMemo(() => {
    return users.find(u => u.id === userId) || null
  }, [users, userId])
}

const Users = () => {
  const users = usersAtom.use() // note
  const selectedUser = useSelectedUser()

  React.useEffect(() => {
    reloadUsers()
  }, [])

  return (
    <UserDisplayArea>
      {selectedUser && <SelectedUserDisplay user={selectedUser} />}
      {users.map(user => (
        <UserDisplay key={user.id} user={user} />
      ))}
    </UserDisplayArea>
  )
}
```
