import catchAsync from '../../utils/catchAsync';

const index = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello World!',
  });
});

export const HomeController = {
  index,
};
