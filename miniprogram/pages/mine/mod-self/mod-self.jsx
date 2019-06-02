<form bindsubmit="handleFormSubmit">
    <view className='layout-vbox page'>
        <scroll-view scroll-y className='grow'>
            <view className='fieldset-title text-xxl'>我的基础信息</view>

            <view className='form-row'>
                <label>我的姓名：</label>
                <input type='text' name="name" value='{{name}}' placeholder='必填，至少2个中文'></input>
            </view>


            <view className='form-row'>
                <label>手机号码：</label>
                <input name="mobile" value='{{mobile}}' type='number' disabled></input>
            </view>

            <view className='form-row'>
                <picker className='grow' range="{{genderArray}}" mode="selector" name="gender" value="{{gender}}"
                        bindchange="handleGenderChange">
                    <label>我的性别：</label>
                    <text>{genderArray[gender]}</text>
                </picker>
            </view>

            <view className='form-row'>
                <picker className='grow' name="birthday" mode="date" value="{{birthday}}"
                        bindchange="handleBirthDayChange">
                    <label>出生日期：</label>
                    {birthday && <text>{birthday ? birthday : ''}</text>}
                    {!birthday && <input placeholder='可选'></input>}
                </picker>
            </view>


            <view className='form-row'>
                <label>居住地址：</label>
                <input name="liveWhere" value='{{liveWhere}}' type='text' placeholder='可选'></input>
            </view>

            <view className='form-row'>
                <label>近期照片：</label>
                <button size='mini' bindtap='handleSelectRecentPhoto'>选择</button>
            </view>
            <view className='pad' wx:if="{{recentPhotoURL}}">
                <image style='width:100%;' mode='aspectFit' name="recentPhotoURL" src='{{recentPhotoURL}}'></image>
            </view>
        </scroll-view>
        <view className='pad'>
            <button className='block' type='primary' form-type="submit">确定修改</button>
        </view>

    </view>
</form>