import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const valueArray = products.map(item => item.quantity * item.price);

    if (!valueArray[0]) return formatValue(0);

    const cartTotalValue = valueArray.reduce(
      (accumulator, actualQuantity) => accumulator + actualQuantity,
    );

    return formatValue(cartTotalValue);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const quantityArray = products.map(item => item.quantity);

    if (!quantityArray[0]) return 0;

    const totalItens = quantityArray.reduce(
      (accumulator, actualQuantity) => accumulator + actualQuantity,
    );

    return totalItens;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
