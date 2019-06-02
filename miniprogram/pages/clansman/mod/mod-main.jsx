<view>
    <view className='fieldset-title text-xxl'>{myself.name}的父母</view>
    <view className='form-row'>
        <view className='grow layout-around'>
            <view className='layout-row'>
                <label>父：</label>
                {father && <text>{father.name}</text>}
                {!father && <navigator url='/pages/clansman/add-father/add-father'
                >
                    ＋＋
                </navigator>}
            </view>
            <view className='layout-row'>
                <label>母：</label>
                {mother && <text>{mother.name}</text>}
                {!mother && <navigator open-type='navigate'
                                       url='/pages/clansman/add-mother/add-mother'
                > ＋＋
                </navigator>}
            </view>
        </view>
    </view>
    <view className='fieldset-title text-xxl'>{myself.name}的配偶</view>
    {mates.map((item, index) =>
        <view className='form-row' key={item.id}>
            <label className='mate-order'>{index + 1}</label>
            <text className='mate-name'>{item.name}</text>
            {index + 1 == mates.length && <button style='margin-left:1vw' className='mini'
                                                  bindtap='handleAddMateBtnTap'>＋
            </button>}
        </view>
    )}
    {mates == null || mates.length == 0 && <view className='form-row'>
        <button className='mini' bindtap='handleAddMateBtnTap'>＋</button>
    </view>}


    <view className='fieldset-title text-xxl'>{myself.name}的子女</view>
    {children.map((item, index) =>
        <view className='form-row' key={item.id}>
            <label className='child-order'>{index + 1}</label>
            <text className='child-name'>{item.name}</text>

            {index + 1 == children.length && <button style='margin-left:1vw' className='mini'
                                                     bindtap='handleAddChildBtnTap'>＋
            </button>}
        </view>
    )}

    {children == null || children.length == 0 && <view className='form-row'>
        <button className='mini' bindtap='handleAddChildBtnTap'>＋</button>
    </view>}
    <view className='pad'>
        <button type='primary' bindtap='handleModifyBtnTap' className='block'>查看/修改{myself.name}个人信息</button>
        {enableDelete && <button type='warn' style='margin-top:15px'
                                 bindtap='handleDeleteBtnTap'
                                 className='block'>删除{myself.name}</button>}
    </view>
</view>