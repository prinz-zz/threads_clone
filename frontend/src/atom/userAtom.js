import { atom } from 'recoil'

const userScreenAtom = atom({
    key: 'userScreenAtom',
    default: JSON.parse(localStorage.getItem('user'))
}) 


export default userScreenAtom