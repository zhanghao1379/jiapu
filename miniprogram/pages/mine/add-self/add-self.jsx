<form bindsubmit="handleFormSubmit">
    <view className='layout-vbox page'>
        <scroll-view scroll-y className='grow'>
            <view className='fieldset-title'>我的父母</view>

            <view className='form-row'>
                <view className='grow layout-around'>
                    <view className='layout-row'>
                        <label>父：</label>
                        <navigator url='/pages/clansman/add-father/add-father'>
                            {father.name ? father.name : '＋＋'}
                        </navigator>

                    </view>
                    <view className='layout-row'>
                        <label>母：</label>
                        <navigator open-type='navigate'
                                   url='/pages/clansman/add-mother/add-mother'> {mother.name ? mother.name : '＋＋'}</navigator>
                    </view>
                </view>
            </view>

            <view className='fieldset-title'>我的基础信息</view>

            <view className='form-row'>
                <label>我的姓名：</label>
                <input type='text' name="name" value='{{myself.name}}' placeholder='必填，至少2个中文'></input>
            </view>
            <view className='form-row'>
                <label>手机号码：</label>
                <input name="mobile" value='{{myself.mobile}}' type='number' placeholder='必填，身份标识'></input>
            </view>


            <view className='form-row'>
                <picker className='grow' range="{{genderArray}}" mode="selector" name="gender" value="{{myself.gender}}"
                        bindchange="handleGenderChange">
                    <label>我的性别：</label>
                    <text>{genderArray[myself.gender]}</text>
                </picker>
            </view>

            <view className='form-row'>
                <picker className='grow' name="birthday" mode="date" value="{{myself.birthday}}"
                        bindchange="handleBirthDayChange">
                    <label>出生日期：</label>

                    {myself.birthday && <text>{myself.birthday}</text>}
                    {!myself.birthday && <input placeholder='可选'></input>}
                </picker>
            </view>
            <view className='form-row'>
                <label>居住地址：</label>
                <input name="liveWhere" value='{{myself.liveWhere}}' type='text' placeholder='可选'></input>
            </view>

            <view className='form-row'>
                <label>近期照片：</label>
                <button size='mini' bindtap='handleSelectRecentPhoto'>选择</button>
            </view>
            {myself.recentPhotoURL && <view className='pad'>
                <image style='width:100%;' mode='aspectFit' name="recentPhotoURL"
                       src='{{myself.recentPhotoURL}}'></image>
            </view>}


            <view className='fieldset-title'>我的配偶</view>
            {mates.map((item, index) =>
                <view className='form-row' key={item.id}>
                    <label className='mate-order'>{index + 1}</label>
                    <navigator className='mate-name' open-type='navigate'
                               url='/pages/clansman/mod-mate/mod-mate?order={{index}}'> {item.name}</navigator>
                    {index + 1 == mates.length && <button style='margin-left:1vw' className='mini'
                                                          bindtap='handleAddMateBtnTap'>＋
                    </button>}
                </view>
            )}

            {mates == null || mates.length == 0 && <view className='form-row'>
                <button className='mini' bindtap='handleAddMateBtnTap'>＋</button>
            </view>}


            <view className='fieldset-title'>我的子女</view>
            {children.map((item, index) =>
                <view className='form-row' key={item.id}>
                    <label className='child-order'>{index + 1}</label>
                    <text className='child-name'>{item.name}</text>
                    <button className='mini' data-order="{{index}}" bindtap='handleDeleteChildBtnTap'>
                        －
                    </button>
                    {index + 1 == children.length && <button style='margin-left:1vw' className='mini'
                                                             bindtap='handleAddChildBtnTap'>＋
                    </button>}
                </view>
            )}
            {children == null || children.length == 0 && <view className='form-row'>
                <button className='mini' bindtap='handleAddChildBtnTap'>＋</button>
            </view>}
        </scroll-view>
        <view className='pad'>
            <button className='block' type='primary' form-type="submit">确定</button>
        </view>

    </view>
</form>