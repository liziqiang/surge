const WIFI_NEED_PROXY = ['bazinga'];
const CURRENT_WIFI_SSID_KEY = 'current_wifi_ssid';

const OUTBOUND_MODE_MAP = {
    RULE: 'rule',
    DIRECT: 'direct',
    GLOBAL_PROXY: 'global_proxy'
};

function wifiChanged() {
    const currentWifiSSid = $persistentStore.read(CURRENT_WIFI_SSID_KEY);
    const changed = currentWifiSSid !== $network.wifi.ssid;
    changed && $persistentStore.write($network.wifi.ssid, CURRENT_WIFI_SSID_KEY);
    return changed;
}

function lookupOutbound(mode) {
    return {
        [OUTBOUND_MODE_MAP.RULE]: '🚦规则模式',
        [OUTBOUND_MODE_MAP.DIRECT]: '🎯直连模式',
        [OUTBOUND_MODE_MAP.GLOBAL_PROXY]: '🚀全局模式'
    }[mode];
}

if (wifiChanged()) {
    const ssid = $network.wifi.ssid;
    const mode = WIFI_NEED_PROXY.includes(ssid) ? OUTBOUND_MODE_MAP.RULE : OUTBOUND_MODE_MAP.DIRECT;
    $surge.setOutboundMode(mode);
    $notification.post(
        '🤖️ SSID 自动策略',
        `当前网络：${ssid ? ssid : '蜂窝数据'}`,
        `Surge已切换至${lookupOutbound(mode)}`
    );
}

$done();
