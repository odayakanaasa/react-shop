interface ISubProduct {
  id: string;
  article: string;
  price: number;
}

interface IImage {
  id: string;
  src: string;
  colorName: string;
}

export interface ICartItem {
  id: number;
  subProduct: ISubProduct;
  // colorId: number;
  price: number;
  amount: number;
}

export interface ICart {
  id: number;
  sessionid: string;
  totalPrice: number;
  amount: number;
  items: [ICartItem];
}

interface IBrand {
  name: string;
}