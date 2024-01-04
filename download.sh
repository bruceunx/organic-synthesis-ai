mkdir -p app/resources/models/context

if [ ! -d app/resources/models/context/v1 ]; then
    echo "app/resources/models/context/v1 not found. Downloading.."
    wget -q --show-progress -O app/resources/models/context/v1.tar.gz \
      "https://www.dropbox.com/scl/fi/97g21iqzxz4gw4l83xjye/v1.tar.gz?rlkey=orny64sno8kd3cbspgbs53qd0&dl=1"
    echo "app/resources/models/context/v1.tar.gz Downloaded. Unzipping.."
    tar xvzf app/resources/models/context/v1.tar.gz -C app/resources/models/context/
    rm app/resources/models/context/v1.tar.gz
fi

if [ ! -d app/resources/models/context/v2 ]; then
    echo "app/resources/models/context/v2 not found. Downloading.."
    wget -q --show-progress -O app/resources/models/context/v2.tar.gz \
      "https://www.dropbox.com/scl/fi/9wft0zbxt6xhd3i3myvfo/v2.tar.gz?rlkey=1ltg6ie1vxc2ookeliotuliaq&dl=1"
    echo "app/resources/models/context/v2.tar.gz Downloaded. Unzipping.."
    tar xvzf app/resources/models/context/v2.tar.gz -C app/resources/models/context/
    rm app/resources/models/context/v2.tar.gz
fi
