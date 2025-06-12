import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AppDispatch, RootState } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';
import { clearSelectedProduct, setSelectedProduct } from '@/store/slices/productSlice';
import Entypo from '@expo/vector-icons/Entypo';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : null;
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProduct, isLoading, error } = useSelector((state: RootState) => state.products);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [quantity, setQuantity] = useState(1);

  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    if (productId) {
      dispatch(setSelectedProduct(productId));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [productId, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [error]);

  const cartItem = cartItems.find(item => item.product.id === productId);
  const itemInCart = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart({ product: selectedProduct, quantity }));
      Alert.alert(
        'Added to Cart',
        `${quantity} ${selectedProduct.title} added to your cart!`,
        [
          { text: 'Continue Shopping', style: 'default' },
          { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') }
        ]
      );
    }
  };

  const incrementQuantity = () => {
    if (selectedProduct && quantity < selectedProduct.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>Loading product details...</ThemedText>
      </ThemedView>
    );
  }

  if (!selectedProduct) {
    return (
      <ThemedView style={styles.errorContainer}>
        <IconSymbol name="exclamationmark.circle" size={64} color="#ff4444" />
        <ThemedText style={styles.errorText}>Product not found</ThemedText>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: tintColor }]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const isOutOfStock = selectedProduct.stock === 0;
  const isLowStock = selectedProduct.stock <= 5 && selectedProduct.stock > 0;

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: selectedProduct.thumbnail }} style={styles.productImage} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.productName}>
              {selectedProduct.title}
            </ThemedText>
            <ThemedText style={styles.category}>
              {selectedProduct.category}
            </ThemedText>
          </View>

          <View style={styles.ratingContainer}>
            <View style={styles.rating}>
              <IconSymbol name="star.fill" size={20} color="#FFD700" />
              <ThemedText style={styles.ratingText}>
                {selectedProduct.rating} / 5.0
              </ThemedText>
            </View>
            <View style={styles.stockContainer}>
              {isOutOfStock ? (
                <ThemedText style={[styles.stockText, { color: '#ff4444' }]}>
                  Out of Stock
                </ThemedText>
              ) : isLowStock ? (
                <ThemedText style={[styles.stockText, { color: '#ff8800' }]}>
                  Only {selectedProduct.stock} left
                </ThemedText>
              ) : (
                <ThemedText style={[styles.stockText, { color: '#00bb00' }]}>
                  In Stock ({selectedProduct.stock} available)
                </ThemedText>
              )}
            </View>
          </View>

          <ThemedText type="defaultSemiBold" style={[styles.price, { color: tintColor }]}>
            ${selectedProduct.price}
          </ThemedText>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Description
            </ThemedText>
            <ThemedText style={styles.description}>
              {selectedProduct.description}
            </ThemedText>
          </View>

          {itemInCart > 0 && (
            <View style={styles.cartInfo}>
              <IconSymbol name="cart.fill" size={20} color={tintColor} />
              <ThemedText style={styles.cartInfoText}>
                {itemInCart} item{itemInCart > 1 ? 's' : ''} in your cart
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.quantityContainer}>
          <ThemedText style={styles.quantityLabel}>Quantity:</ThemedText>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: tintColor }]}
              onPress={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Entypo 
                name="minus" 
                size={20} 
                color={quantity <= 1 ? '#ccc' : tintColor} 
              />
            </TouchableOpacity>
            <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: tintColor }]}
              onPress={incrementQuantity}
              disabled={quantity >= selectedProduct.stock}
            >
              <Entypo 
                name="plus" 
                size={20} 
                color={quantity >= selectedProduct.stock ? '#ccc' : tintColor} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            { 
              backgroundColor: isOutOfStock ? '#ccc' : tintColor,
            }
          ]}
          onPress={handleAddToCart}
          disabled={isOutOfStock}
        >
          <IconSymbol name="cart.fill" size={24} color="white" />
          <ThemedText style={styles.addToCartText}>
            {isOutOfStock ? 'Out of Stock' : `Add to Cart - $${(selectedProduct.price * quantity).toFixed(2)}`}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  productImage: {
    width: width,
    height: width * 0.8,
    resizeMode: 'cover',
    
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 15,
  },
  productName: {
    marginBottom: 5,
  },
  category: {
    opacity: 0.6,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  stockContainer: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 28,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  description: {
    lineHeight: 24,
    opacity: 0.8,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  cartInfoText: {
    marginLeft: 10,
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  quantityText: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '600',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
  },
  addToCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});