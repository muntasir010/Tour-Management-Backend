import { enVars } from "../config/env";
import { IAuthProviders, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async() => {
    try{
        const isUserAdminExist = await User.findOne({email: enVars.SUPER_ADMIN_EMAIL})
        if(isUserAdminExist){
            console.log("Super Admin Already Exist");
            return;
        };

        console.log("Trying to create super admin")

        const hashedPassword = await bcryptjs.hash(enVars.SUPER_ADMIN_PASSWORD, Number(enVars.BCRYPT_SALT_ROUND));

        const authProvider : IAuthProviders = {
            provider: "credential",
            providerId: enVars.SUPER_ADMIN_EMAIL,
        }

        const payload: IUser = {
            name: "Super Admin",
            role: Role.SUPER_ADMIN,
            email: enVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auth: [authProvider],
        }

        const superAdmin = await User.create(payload);
        console.log(superAdmin);
        console.log("Super Admin Created Successfully!")
    }catch(error){
        console.log(error)
    }
};
