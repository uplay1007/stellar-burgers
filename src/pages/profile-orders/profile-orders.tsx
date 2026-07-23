import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders } from '@selectors';
import { setUserOrders } from '@slices';
import { getCookie } from '../../utils/cookie';
import { getUserOrdersWsUrl } from '../../utils/ws-api';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) return;

    const ws = new WebSocket(getUserOrdersWsUrl(accessToken));

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        dispatch(setUserOrders(data.orders));
      }
    };

    return () => ws.close();
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
