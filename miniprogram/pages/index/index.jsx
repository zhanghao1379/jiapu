<scroll-view scroll-x scroll-y style='width:100vh;height:100vh'>
    {roots.map((item, index) =>
        <clannode
            clansman="{{item}}"
        ></clannode>
    )}

</scroll-view>
