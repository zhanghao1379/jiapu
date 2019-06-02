<view className="child-node {{nodeOrderClass}}">
    <view className='parents-node'>
        <view className="parents-main-node" data-id='{{clansman._id}}' bindtap='handleMainNodeTap'>
            {clansman.name}</view>

        <view className='parents-mate-nodes'>
            {mates.map((item, index) =>
                <view className='parents-mate-node'
                      key={item._id}
                      bindtap='handleMateNodeTap'
                      data-id="{{item._id}}">
                    {item.name}
                </view>
            )}
        </view>
    </view>
    <view className='child-nodes' wx:if='{{children.length>0}}'>
        {children.map((item, index) =>
            <clannode
                clansman="{{ item }}"
                key={item._id}
            ></clannode>
        )}
    </view>
</view>