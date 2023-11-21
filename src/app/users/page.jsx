import { UsersForm } from "@/component/Form"
import { UsersProvider } from "@/component/provider/Users"

export default async function UsersPage() {
    return (
        <UsersProvider>
            <UsersForm />
        </UsersProvider>
    )
}