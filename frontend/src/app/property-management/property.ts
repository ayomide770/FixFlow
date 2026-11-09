export interface Property {
  _id: string;
  propertyName: string;
  propertyType: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  status: string;
  notes: string;
}

// New properties do not have a MongoDB ID yet
export type PropertyInput = Omit<Property, '_id'>;
