import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AppDispatch, RootState } from '@/store';
import {
  CartItem,
  clearCart,
  decrementQuantity,
  incrementQuantity,
  removeFromCart
} from '@/store/slices/cartSlice';
import Entypo from '@expo/vector-icons/Entypo';

import { createOrder } from '@/store/slices/orderSlice';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function CartScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalAmount, totalItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.orders);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleRemoveItem = (productId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => dispatch(removeFromCart(productId))
        }
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => dispatch(clearCart())
        }
      ]
    );
  };

  const handleCheckout = async () => {
    if (!user || items.length === 0) return;

    try {
      const orderData = {
        userId: user.id,
        items,
        totalAmount,
        totalItems,
        deliveryAddress: '123 Main St, City, State 12345',
      };

      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());

      Alert.alert(
        'Order Placed Successfully!',
        'Your order has been placed and will be processed shortly.',
        [
          { text: 'View Orders', onPress: () => router.push('/(tabs)/orders') },
          { text: 'Continue Shopping', onPress: () => router.push('/(tabs)') }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    return (
      <View style={styles.cartItem}>
        <TouchableOpacity onPress={() => router.push(`/product/${item.product.id}`)}>
          <Image source={{ uri: item?.product?.thumbnail }} style={styles.itemImage} />
        </TouchableOpacity>

        <View style={styles.itemDetails}>
          <TouchableOpacity onPress={() => router.push(`/product/${item.product.id}`)}>
            <ThemedText type="defaultSemiBold" style={styles.itemName} numberOfLines={2}>
              {item.product.title}
            </ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.itemCategory}>
            {item.product.category}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={[styles.itemPrice, { color: tintColor }]}>
            ${item.product.price}
          </ThemedText>
        </View>

        <View style={styles.quantitySection}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: tintColor }]}
              onPress={() => dispatch(decrementQuantity(item.product.id))}
            >
              <Entypo name="minus" size={16} color={tintColor} />
            </TouchableOpacity>

            <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>

            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: tintColor }]}
              onPress={() => dispatch(incrementQuantity(item.product.id))}
            >
              <Entypo name="plus" size={16} color={tintColor} />
            </TouchableOpacity>
          </View>

          <ThemedText type="defaultSemiBold" style={styles.itemTotal}>
            ${(item.product.price * item.quantity).toFixed(2)}
          </ThemedText>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.product.id)}
          >
            <IconSymbol name="trash" size={20} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="cart" size={100} color="#ccc" />
      <ThemedText type="title" style={styles.emptyTitle}>
        Your cart is empty
      </ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Add some products to get started
      </ThemedText>
      <TouchableOpacity
        style={[styles.shopButton, { backgroundColor: tintColor }]}
        onPress={() => router.push('/(tabs)')}
      >
        <ThemedText style={styles.shopButtonText}>
          Start Shopping
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  if (items.length === 0) {
    return (
      <ThemedView style={styles.container}>
        {renderEmptyCart()}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Shopping Cart</ThemedText>
        <TouchableOpacity onPress={handleClearCart}>
          <ThemedText style={[styles.clearButton, { color: '#ff4444' }]}>
            Clear All
          </ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.cartListContainer}
        ListFooterComponent={
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Items ({totalItems}):</ThemedText>
              <ThemedText style={styles.summaryValue}>${totalAmount.toFixed(2)}</ThemedText>
            </View>

            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Shipping:</ThemedText>
              <ThemedText style={styles.summaryValue}>Free</ThemedText>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <ThemedText type="defaultSemiBold" style={styles.totalLabel}>
                Total:
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={[styles.totalValue, { color: tintColor }]}>
                ${totalAmount.toFixed(2)}
              </ThemedText>
            </View>

            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: tintColor }]}
              onPress={handleCheckout}
              disabled={isLoading}
            >
              <IconSymbol name="creditcard.fill" size={24} color="white" />
              <ThemedText style={styles.checkoutButtonText}>
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  cartListContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  clearButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  cartList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
  },
  quantitySection: {
    alignItems: 'flex-end',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  itemTotal: {
    fontSize: 16,
    marginBottom: 10,
  },
  removeButton: {
    padding: 5,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
  },
  totalValue: {
    fontSize: 20,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
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
    marginBottom: 30,
  },
  shopButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});