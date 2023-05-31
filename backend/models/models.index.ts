// UUID string wrapper to distinguish from other strings
export type UUID = string;

// Import models and types separately
import LogItemModel, { LogItem } from './LogItem';
import GroupEventModel, { GroupEvent } from './Event';
import GroupModel, { Group } from './Group';
import MerchTypeModel, { MerchType } from './MerchType';
import MerchInstanceModel, { MerchInstance } from './MerchInstance';
import UserModel, { User } from './User';

// Export a single object with all models
export const models = {
    LogItemModel,
    GroupEventModel,
    GroupModel,
    MerchTypeModel,
    MerchInstanceModel,
    UserModel
};

// Export a single object with all types
export type {
    LogItem,
    GroupEvent,
    Group,
    MerchType,
    MerchInstance,
    User
};
