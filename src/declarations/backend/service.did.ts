import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Charge {
  'id' : string,
  'status' : ChargeStatus,
  'merchant_id' : Principal,
  'pricing_type' : string,
  'payments' : Array<Payment>,
  'metadata' : [] | [Metadata],
  'name' : string,
  'local_price' : LocalPrice,
  'description' : string,
  'created_at' : bigint,
  'payment_block_height' : [] | [bigint],
  'release_block_height' : [] | [bigint],
}
export interface ChargeCreate {
  'pricing_type' : string,
  'metadata' : [] | [Metadata],
  'name' : string,
  'local_price' : LocalPrice,
  'description' : string,
}
export type ChargeStatus = { 'Failed' : null } |
  { 'Completed' : null } |
  { 'Expired' : null } |
  { 'Pending' : null };
export interface Checkout {
  'id' : string,
  'status' : CheckoutStatus,
  'requested_info' : Array<string>,
  'updated_at' : bigint,
  'payment_link' : string,
  'merchant_id' : Principal,
  'pricing_type' : string,
  'name' : string,
  'local_price' : LocalPrice,
  'description' : string,
  'created_at' : bigint,
}
export interface CheckoutCreate {
  'requested_info' : Array<string>,
  'pricing_type' : string,
  'name' : string,
  'local_price' : LocalPrice,
  'description' : string,
}
export type CheckoutStatus = { 'Completed' : null } |
  { 'Expired' : null } |
  { 'Pending' : null };
export interface CryptoValue { 'currency' : string, 'amount' : string }
export interface EventData {
  'id' : string,
  'pricing_type' : string,
  'payments' : Array<WhPayment>,
  'metadata' : [] | [WhMetadata],
  'code' : [] | [string],
  'name' : [] | [string],
  'hosted_url' : [] | [string],
  'description' : [] | [string],
  'timeline' : Array<Timeline>,
}
export type EventType = { 'CheckoutCreated' : null } |
  { 'ChargeReleaseFailed' : null } |
  { 'CheckoutExpired' : null } |
  { 'ChargeDelayed' : null } |
  { 'ChargeCreated' : null } |
  { 'ChargePending' : null } |
  { 'ChargeFailed' : null } |
  { 'CheckoutCompleted' : null } |
  { 'ChargeConfirmed' : null };
export interface LocalPrice { 'currency' : string, 'amount' : string }
export interface LocalValue { 'currency' : string, 'amount' : string }
export interface Metadata {
  'customer_id' : [] | [string],
  'customer_name' : [] | [string],
}
export interface Payment {
  'transaction_id' : string,
  'from' : Principal,
  'created_at' : bigint,
  'amount' : string,
}
export interface PaymentValue { 'local' : LocalValue, 'crypto' : CryptoValue }
export interface Timeline { 'status' : string, 'time' : string }
export interface WebhookConfig {
  'url' : string,
  'merchant_id' : Principal,
  'secret' : string,
  'enabled' : boolean,
}
export interface WebhookEvent {
  'id' : string,
  'resource' : string,
  'api_version' : string,
  'data' : EventData,
  'created_at' : bigint,
  'event_type' : EventType,
}
export interface WhMetadata {
  'customer_id' : [] | [string],
  'customer_name' : [] | [string],
}
export interface WhPayment {
  'transaction_id' : string,
  'status' : string,
  'value' : PaymentValue,
  'created_at' : string,
  'block_height' : bigint,
}
export interface _SERVICE {
  'create_charge' : ActorMethod<
    [ChargeCreate],
    { 'Ok' : Charge } |
      { 'Err' : string }
  >,
  'create_checkout' : ActorMethod<
    [CheckoutCreate],
    { 'Ok' : Checkout } |
      { 'Err' : string }
  >,
  'get_charge' : ActorMethod<[string], { 'Ok' : Charge } | { 'Err' : string }>,
  'get_checkout' : ActorMethod<
    [string],
    { 'Ok' : Checkout } |
      { 'Err' : string }
  >,
  'get_webhook_config' : ActorMethod<
    [],
    { 'Ok' : WebhookConfig } |
      { 'Err' : string }
  >,
  'list_charges' : ActorMethod<[], Array<Charge>>,
  'process_payment' : ActorMethod<
    [string],
    { 'Ok' : bigint } |
      { 'Err' : string }
  >,
  'register_merchant' : ActorMethod<[], { 'Ok' : null } | { 'Err' : string }>,
  'register_webhook' : ActorMethod<
    [WebhookConfig],
    { 'Ok' : null } |
      { 'Err' : string }
  >,
  'verify_webhook' : ActorMethod<
    [string, string],
    { 'Ok' : WebhookEvent } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
