# react-state-atom

`react-state-atom` is a global state management solution for React + TypeScript

## Pros and cons of react-state-atom

### Pros

- Provider-free
- Hook-based
- Tiny (942 bytes minified, 409 bytes Brotli'd)
- TypeScript-first
- Test-friendly
- Non-extensible API - no rabbit holes

### Cons

- Lower hypothetical performance ceiling than recursive-proxy-based solutions like Valtio or Mobx
- No support for Redux devtools

## API

### createAtom<T>(initial: T): Atom<T>

Creates a global state atom.

### Atom.getValue(): T

Returns the current value of the atom.

### Atom.setValue(value: T): void

Sets the value of the atom. Triggers updates in hooks and subscribers.

### Atom.subscribe(cb: (value: T, prev: T) => void): () => void

Subscribes a callback function to an atom. The callback is called every time the value of the atom changes. Returns an `unsubscribe` function that terminates the subscription.

### Atom.useValue(): T

Use the atom as a hook. Returns the value of the atom. The value is updated every time the value of the atom changes.

### resetGlobalState(): void

Resets the value of all created atoms to `initial` (the original value passed to `createAtom`). Triggers updates in hooks and subscribers. (Useful for testing and refresh-free logouts.)

## Example

```tsx
import { createAtom } from 'react-state-atom'

const usersAtom = createAtom<User[]>([])
const selectedIdAtom = createAtom<number | null>(null)

async function reloadUsers() {
  const users = (await axios.get('/users')).data as User
  users.setValue(users) // note
}

async function createUser(params: UserParams) {
  const user = (await axios.post('/user', params)).data as User
  usersAtom.setValue([...usersAtom.get(), user]) // note
}

function useSelectedUser() {
  const users = usersAtom.useValue() // note
  const userId = selectedIdAtom.useValue() // note

  return React.useMemo(() => {
    return users.find(u => u.id === userId) || null
  }, [users, userId])
}

const Users = () => {
  const users = usersAtom.useValue() // note
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

## Global state

"Global state" is another name for "application state", which we need in order to write so-called "stateful applications".

Global state becomes a problem when your program doesn't know when or how to react to it changing -- in other words, in non-reactive contexts. Luckily for you, you're using React, which allows you to use global state in a productive, non-horrible way via reactive patterns like hooks.

So don't fear global state. Embrace it!

![global state meme](https://github.com/ethangclark/react-state-atom/blob/main/ohio.webp?raw=true)
