import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectFeedOrders } from '@selectors';
import { setFeedOrders } from '@slices';
import { FEED_WS_URL } from '../../utils/ws-api';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const [reconnectKey, setReconnectKey] = useState(0);
  const [connectionFailed, setConnectionFailed] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const ws = new WebSocket(FEED_WS_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        dispatch(setFeedOrders(data));
      }
    };

    ws.onerror = () => {
      if (!isCancelled) setConnectionFailed(true);
    };

    // Закрытие не по нашей инициативе (event.wasClean === false) означает,
    // что соединение оборвалось само — например, сервер недоступен. Наше
    // собственное закрытие в cleanup-функции ниже под это не подпадает.
    ws.onclose = (event) => {
      if (!isCancelled && !event.wasClean) setConnectionFailed(true);
    };

    return () => {
      isCancelled = true;
      ws.close();
    };
  }, [dispatch, reconnectKey]);

  const handleGetFeeds = () => {
    setConnectionFailed(false);
    setReconnectKey((key) => key + 1);
  };

  if (!orders.length && !connectionFailed) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
