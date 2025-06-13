"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BleManager = require("react-native-ble-manager");
const utils_1 = require("../utils");
const event_target_shim_1 = require("event-target-shim");
const BLEModule_1 = require("./BLEModule");
/**
 * Shim for https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTCharacteristic
 *
 */
class BluetoothRemoteGATTCharacteristic extends event_target_shim_1.EventTarget {
    /**
     * Constructor.
     * @param service Service to which this characteristic belongs.
     * @param uuid UUID of this characteristic.
     * @param properties characteristic properties.
     */
    constructor(service, uuid, properties) {
        super();
        this.service = service;
        this.uuid = uuid;
        super();
    }
    /**
     * Writes a value to the characteristic.
     *
     * @param value ArrayBuffer to be written to characteristic
     */
    writeValueWithResponse(value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BleManager.write(this.service.device.id, this.service.uuid, this.uuid, Array.from(new Uint8Array(value)),
                    /**
                     * The underlying library currently splits payloads if they are larger
                     * than the below number. Since we have our own fragmentation, we are setting
                     * this to a value so that the library's fragmentation
                     * logic does not get triggered.
                     */
                    value.byteLength);
            }
            catch (err) {
                console.error(`Error writing ${value} to Characteristic: ${this.uuid} of Service: ${this.service.uuid}`);
                throw new Error(err);
            }
        });
    }
    /**
     * Reads the characteristic's current value. This will not be needed in the
     * final release since eLockers won't support read ops. Implemented to make
     * testing easier.
     */
    readValue() {
        return __awaiter(this, void 0, void 0, function* () {
            const byteArray = yield BleManager.read(this.service.device.id, this.service.uuid, this.uuid);
            this.value = utils_1.byteArrayToDataView(byteArray);
            return this.value;
        });
    }
    /**
     * Subscribe to notifications for a characteristic's
     * value changes. Any change fires the "characteristicvaluechanged" event
     * on the characteristic.
     */
    startNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            this._characteristicUpdateSubscription = BLEModule_1.BleManagerEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", ({ value }) => {
                this.dispatchEvent({
                    type: "characteristicvaluechanged",
                    value: utils_1.byteArrayToDataView(value)
                });
            });
            try {
                yield BleManager.startNotification(this.service.device.id, this.service.uuid, this.uuid);
            }
            catch (err) {
                this._characteristicUpdateSubscription.remove();
                console.log(`Error subscribing to characteristic: ${this.uuid} of service: ${this.service.uuid} notifications`);
                throw new Error(err);
            }
        });
    }
    /**
     * Unsubscribe from notifications.
     */
    stopNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield BleManager.stopNotification(this.service.device.id, this.service.uuid, this.uuid);
            }
            catch (err) {
                console.log(`Error unsubscribing to characteristic: ${this.uuid} of service: ${this.service.uuid} notifications`);
                throw new Error(err);
            }
            if (this._characteristicUpdateSubscription) {
                this._characteristicUpdateSubscription.remove();
                this._characteristicUpdateSubscription = undefined;
            }
        });
    }
}
exports.BluetoothRemoteGATTCharacteristic = BluetoothRemoteGATTCharacteristic;