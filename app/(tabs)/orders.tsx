import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AppDispatch, RootState } from '@/store';
import { fetchOrders, Order } from '@/store/slices/orderSlice';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function OrdersScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading } = useSelector((state: RootState) => state.orders);
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const tintColor = useThemeColor({}, 'tint');

  // useEffect(() => {
  //   if (user) {
  //     dispatch(fetchOrders(user?.id));
  //   }
  // }, [dispatch, user]);

  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await dispatch(fetchOrders(user.id));
      setRefreshing(false);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#00bb00';
      case 'shipped':
        return '#007bff';
      case 'confirmed':
        return '#ff8800';
      case 'pending':
        return '#ffbb00';
      case 'cancelled':
        return '#ff4444';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'checkmark.circle.fill';
      case 'shipped':
        return 'shippingbox.fill';
      case 'confirmed':
        return 'clock.fill';
      case 'pending':
        return 'hourglass';
      case 'cancelled':
        return 'xmark.circle.fill';
      default:
        return 'circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrders.has(item.id);
    const statusColor = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => toggleOrderExpansion(item.id)}
        >
          <View style={styles.orderInfo}>
            <View style={styles.orderTitleRow}>
              <ThemedText type="defaultSemiBold" style={styles.orderId}>
                Order #{item.id}
              </ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <IconSymbol name={statusIcon} size={12} color="white" />
                <ThemedText style={styles.statusText}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </ThemedText>
              </View>
            </View>

            <ThemedText style={styles.orderDate}>
              {formatDate(item.createdAt)}
            </ThemedText>

            <View style={styles.orderSummary}>
              <ThemedText style={styles.itemCount}>
                {item.totalItems} item{item.totalItems > 1 ? 's' : ''}
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={[styles.orderTotal, { color: tintColor }]}>
                ${item.totalAmount.toFixed(2)}
              </ThemedText>
            </View>
          </View>

          <IconSymbol
            name={isExpanded ? 'chevron.up' : 'chevron.down'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.orderDetails}>
            <View style={styles.deliveryInfo}>
              <IconSymbol name="location.fill" size={16} color="#999" />
              <ThemedText style={styles.deliveryAddress}>
                {item.deliveryAddress}
              </ThemedText>
            </View>

            <View style={styles.itemsList}>
              <ThemedText type="defaultSemiBold" style={styles.itemsTitle}>
                Items Ordered:
              </ThemedText>
              {item.items.map((cartItem, index) => {
                return (
                  <View key={index} style={styles.orderItemRow}>
                    <Image
                      source={{ uri: cartItem.product.thumbnail }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <ThemedText style={styles.itemName} numberOfLines={2}>
                        {cartItem.product.title}
                      </ThemedText>
                      <ThemedText style={styles.itemQuantity}>
                        Qty: {cartItem.quantity}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.itemPrice}>
                      ${(cartItem.product.price * cartItem.quantity).toFixed(2)}
                    </ThemedText>
                  </View>
                )

              })}
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.totalBreakdown}>
                <View style={styles.totalRow}>
                  <ThemedText>Subtotal:</ThemedText>
                  <ThemedText>${item.totalAmount.toFixed(2)}</ThemedText>
                </View>
                <View style={styles.totalRow}>
                  <ThemedText>Shipping:</ThemedText>
                  <ThemedText>Free</ThemedText>
                </View>
                <View style={[styles.totalRow, styles.finalTotal]}>
                  <ThemedText type="defaultSemiBold">Total:</ThemedText>
                  <ThemedText type="defaultSemiBold" style={{ color: tintColor }}>
                    ${item.totalAmount.toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="bag" size={100} color="#ccc" />
      <ThemedText type="title" style={styles.emptyTitle}>
        No orders yet
      </ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Your order history will appear here once you make your first purchase
      </ThemedText>
    </View>
  );

  if (isLoading && orders.length === 0) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading orders...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Order History</ThemedText>
        <ThemedText style={styles.subtitle}>
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </ThemedText>
      </View>

      {orders.length === 0 ? (
        renderEmptyOrders()
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          style={styles.ordersList}
          showsVerticalScrollIndicator={false}

        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 5,
  },
  ordersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  orderDate: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 8,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 14,
    opacity: 0.8,
  },
  orderTotal: {
    fontSize: 16,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 15,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  deliveryAddress: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.8,
  },
  itemsList: {
    marginBottom: 15,
  },
  itemsTitle: {
    marginBottom: 10,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    opacity: 0.6,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  totalBreakdown: {},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.6,
  },
});