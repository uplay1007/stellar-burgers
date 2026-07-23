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

  useEffect(() => {
    const ws = new WebSocket(FEED_WS_URL);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.success) {
        dispatch(setFeedOrders(data));
      }
    };

    return () => ws.close();
  }, [dispatch, reconnectKey]);

  const handleGetFeeds = () => setReconnectKey((key) => key + 1);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
