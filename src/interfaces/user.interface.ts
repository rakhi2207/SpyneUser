export interface userLogin{
    email: string,
    password: string
}
export interface user extends userLogin{
    name: string,
    mobileNo: string
}

export interface updateUserData extends user{
    id: string
}