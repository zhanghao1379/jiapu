<view className='margin-sm' scroll-y style='height:100%'>
    <view className='layout-row gap '>
        <image class="round small-avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
        <text space='emsp'> {userInfo.nickName}</text>
    </view>
    <view className='setting text-lg'>
        <navigator url='/pages/mine/mod-self/mod-self' className='setting-item layout-justify-center'>
            <text>我的基础信息</text>
            <text decode>&gt;</text>
        </navigator>
        <navigator url='/pages/birthday/list' className='setting-item layout-justify-center'>
            <text>最近生日</text>
            <text decode>&gt;</text>
        </navigator>
        <navigator url='/pages/birthday-alert/setting' className='setting-item layout-justify-center'>
            <text>生日提醒</text>
            <text decode>&gt;</text>
        </navigator>
        <navigator url='/pages/mine/help/help' className='setting-item layout-justify-center'>
            <text>帮助</text>
            <text decode>&gt;</text>
        </navigator>
        <navigator url='/pages/mine/about/about' className='setting-item layout-justify-center'>
            <text>关于</text>
            <text decode>&gt;</text>
        </navigator>

    </view>
</view>