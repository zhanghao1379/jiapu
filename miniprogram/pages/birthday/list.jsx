<scroll-view scroll-y style='height:100vh'>
    {list.length > 0 && list.map((item, index) =>
        <view key={item.id} className="list-item">
            <text>{item.name}({item.birthday})</text>
            <text>{item.when}</text>
        </view>
    )}
    {list.length <= 0 &&
    <view style='text-align:center'>
        暂无族人设置了生日。
    </view>
    }
</scroll-view>