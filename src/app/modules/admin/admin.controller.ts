import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from '../user/user.service';

const blockAnUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = UserServices.blockUserInDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User blocked successfully',
    data: result,
  });
});

export const AdminControllers = {
  blockAnUser,
};
