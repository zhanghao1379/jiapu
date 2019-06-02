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

                    <text wx:if="{{myself.birthday}}">{myself.birthday}</text>
                    <input placeholder='可选' wx:else></input>
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
            <view className='pad' wx:if="{{myself.recentPhotoURL}}">
                <image style='width:100%;' mode='aspectFit' name="recentPhotoURL"
                       src='{{myself.recentPhotoURL}}'></image>
            </view>


            <view className='fieldset-title'>我的配偶</view>

            <view className='form-row' wx:for="{{mates}}" wx:key="id">
                <label className='mate-order'>{index + 1}</label>
                <navigator className='mate-name' open-type='navigate'
                           url='/pages/clansman/mod-mate/mod-mate?order={{index}}'> {item.name}</navigator>
                <button style='margin-left:1rem' wx:if='{{index+1==mates.length}}' className='mini'
                        bindtap='handleAddMateBtnTap'>＋
                </button>
            </view>
            <view className='form-row' wx:if="{{mates==null||mates.length==0}}">
                <button className='mini' bindtap='handleAddMateBtnTap'>＋</button>
            </view>


            <view className='fieldset-title'>我的子女</view>
            <view className='form-row' wx:for="{{children}}" wx:key="id">
                <label className='child-order'>{index + 1}</label>
                <text className='child-name'>{item.name}</text>
                <button className='mini' data-order="{{index}}" bindtap='handleDeleteChildBtnTap'>
                    －
                </button>
                <button style='margin-left:1rem' wx:if='{{index+1==children.length}}' className='mini'
                        bindtap='handleAddChildBtnTap'>＋
                </button>
            </view>
            <view className='form-row' wx:if="{{children==null||children.length==0}}">
                <button className='mini' bindtap='handleAddChildBtnTap'>＋</button>
            </view>
        </scroll-view>
        <view className='pad'>
            <button className='block' type='primary' form-type="submit">确定</button>
        </view>

    </view>
</form>