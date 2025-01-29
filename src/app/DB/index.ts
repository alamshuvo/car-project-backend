import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const adminUser: TUser = {
  name: 'admin',
  email: 'admin@gmail.com',
  password: config.admin_password as string,
  role: USER_ROLE.admin,
  isBlocked: false,
  isDeleted: false,
};

const seedAdmin = async () => {
  //when database is connected, we will check if there's any user who is admin
  const isAdminExits = await User.findOne({ role: USER_ROLE.admin });

  if (!isAdminExits) {
    await User.create(adminUser);
  }
};

export default seedAdmin;
