<view class="authorize flex align-center flex-direction margin-top-xl">
    <view class="margin-top-xl">
        <image src="../../images/logo.png" class="authorize-logo-image"></image>
    </view>
    <view className='content flex flex-direction align-center margin-top-xl'>
        <view>申请获取以下权限</view>
        <text class="margin-top text-gray">获得你的公开信息(昵称，头像等)</text>
    </view>
    <view class="margin-top-xl">
        <button type="primary" class="authorize-button margin-top-xl" lang="ZH_CN" open-type="getUserInfo"
                bindgetuserinfo='handleConfirmBtnTap'>授权登录
        </button>
    </view>
</view>