import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders } from '@selectors';
import { setUserOrders } from '@slices';
import { refreshToken } from '@api';
import { getCookie } from '../../utils/cookie';
import { getUserOrdersWsUrl } from '../../utils/ws-api';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);

  useEffect(() => {
    let ws: WebSocket | undefined;
    let isCancelled = false;
    let hasRetried = false;

    const connect = (accessToken: string) => {
      ws = new WebSocket(getUserOrdersWsUrl(accessToken));

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.success) {
          dispatch(setUserOrders(data.orders));
          return;
        }

        // Токен мог истечь между загрузкой страницы и открытием сокета —
        // обновляем его так же, как это делает fetchWithRefresh для HTTP.
        if (!hasRetried) {
          hasRetried = true;
          refreshToken().then((refreshData) => {
            if (!isCancelled) connect(refreshData.accessToken);
          });
        }
      };
    };

    const accessToken = getCookie('accessToken');
    if (accessToken) {
      connect(accessToken);
    }

    return () => {
      isCancelled = true;
      ws?.close();
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
