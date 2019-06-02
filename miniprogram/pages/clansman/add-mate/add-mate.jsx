<form bindsubmit="handleFormSubmit">
    <view className='layout-vbox page'>
        <scroll-view scroll-y className='grow'>
            <view className='form-row'>
                <label>配偶姓名：</label>
                <input name="name" value='{{name}}' placeholder='必填，至少2个中文' type='text'></input>
            </view>
            <view className='form-row'>
                <picker className='grow' name="mateOrder" range="{{mateOrderArray}}" mode="selector"
                        value="{{mateOrder}}" bindchange="handleMateOrderChange">
                    <label> 第几任：</label>
                    <text>{mateOrderArray[mateOrder]}</text>
                </picker>
            </view>
            <view className='form-row'>
                <picker className='grow' range="{{genderArray}}" mode="selector" name="gender" value="{{gender}}"
                        bindchange="handleGenderChange">
                    <label>配偶性别：</label>
                    <text>{genderArray[gender]}</text>
                </picker>
            </view>
            <view className='form-row'>
                <picker className='grow' name="birthday" mode="date" value="{{birthday}}" start="1950-01-01"
                        bindchange="handleBirthDayChange">
                    <label>出生日期：</label>
                    {birthday && <text>{birthday}</text>}
                    {!birthday && <input placeholder='可选'></input>}
                </picker>
            </view>


            <view className='form-row'>
                <label>手机号码：</label>
                <input name="mobile" type='number' value='{{mobile}}' placeholder='可选'></input>
            </view>
            <view className='form-row'>
                <label>居住地址：</label>
                <input name="liveWhere" value='{{liveWhere}}' type='text' placeholder='可选'></input>
            </view>

            <view className='form-row'>
                <label>近期照片：</label>
                <button size='mini' bindtap='handleSelectRecentPhoto'>
                    选择
                </button>

            </view>
            {recentPhotoURL && <view className='pad'>
                <image style='width:100%;' mode='aspectFit' src='{{recentPhotoURL}}'></image>
            </view>}
        </scroll-view>
        <view className='pad'>
            <button className='block' type='primary' form-type="submit">确定</button>
        </view>
    </view>
</form>