interface ILogin {
  username: string;
  password: string;
}

let logins: ILogin[] = [];

export function register(username: string, password: string) {
  if (logins.some((login) => login.username === username)) return false;
  logins.push({ username, password });
  console.log(logins);
  return true;
}

export function try_login(username: string, password: string) {
  console.log(`client login attempt ${username} ${password}`)
  return logins.some(
    (login) => login.username === username && login.password === password
  ) && !users.some((user) => user.username === username);
}

interface IUser {
  id: string;
  username: string;
}

//users currently online
let users: IUser[] = [];

export function addUser(id: string, username: string) {
  users.push({ id, username });
}

export function removeUser(id: string) {
  users = users.filter((user) => user.id !== id);
}

export function getUsers() {
  return users;
}
