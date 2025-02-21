import { Order } from './order.model';

export const findLastOrderId = async () => {
  const lastOrder = await Order.find()
    .sort({
      createdAt: -1,
    })
    .limit(1);
  return lastOrder[0] && lastOrder[0]['orderId']
    ? lastOrder[0]['orderId']
    : undefined;
};

export const generateOrderId = async () => {
  let currentId = (0).toString();
  const lastOrderId = await findLastOrderId();
  if (lastOrderId) {
    currentId = lastOrderId.substring(4);
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(5, '0');
  incrementId = `ORD-${incrementId}`;
  return incrementId;
};
