mkdir -p mars

if [ ! -f mars/bkms_metabolic.mar ]; then
    echo "mars/bkms_metabolic.mar not found. Downloading.."
    wget -q --show-progress -O mars/bkms_metabolic.mar \
      "https://www.dropbox.com/s/dux2enmspyaxfho/bkms_metabolic.mar?dl=1"
    echo "mars/bkms_metabolic.mar Downloaded."
fi

if [ ! -f mars/pistachio_ringbreaker.mar ]; then
    echo "mars/pistachio_ringbreaker.mar not found. Downloading.."
    wget -q --show-progress -O mars/pistachio_ringbreaker.mar \
      "https://www.dropbox.com/s/8sfmxbu5ogurjzl/pistachio_ringbreaker.mar?dl=1"
    echo "mars/pistachio_ringbreaker.mar Downloaded."
fi

if [ ! -f mars/pistachio.mar ]; then
    echo "mars/pistachio.mar not found. Downloading.."
    wget -q --show-progress -O mars/pistachio.mar \
      "https://www.dropbox.com/s/3ql3vkbn4pohfa2/pistachio.mar?dl=1"
    echo "mars/pistachio.mar Downloaded."
fi

if [ ! -f mars/reaxys_biocatalysis.mar ]; then
    echo "mars/reaxys_biocatalysis.mar not found. Downloading.."
    wget -q --show-progress -O mars/reaxys_biocatalysis.mar \
      "https://www.dropbox.com/s/d627vnxzwa8t75m/reaxys_biocatalysis.mar?dl=1"
    echo "mars/reaxys_biocatalysis.mar Downloaded."
fi

if [ ! -f mars/reaxys.mar ]; then
    echo "mars/reaxys.mar not found. Downloading.."
    wget -q --show-progress -O mars/reaxys.mar \
      "https://www.dropbox.com/s/yry380bd2ik1r4w/reaxys.mar?dl=1"
    echo "mars/reaxys.mar Downloaded."
fi

if [ -n "${DROPBOX_LINK_PASSWORD}" ]; then
    if [ ! -f mars/cas.mar ]; then
        echo "mars/cas.mar not found. Downloading.."
        curl -X POST https://content.dropboxapi.com/2/sharing/get_shared_link_file \
          --header "Authorization: Bearer ${DROPBOX_ACCESS_TOKEN}" \
          --header "Dropbox-API-Arg: {\"path\":\"/cas.mar\",\"url\":\"https://www.dropbox.com/scl/fi/rlstmf6sxaok92s5jpne5/cas.mar?rlkey=xcjspt52j5pktmq8rds249lk7&dl=0\", \"link_password\":\"${DROPBOX_LINK_PASSWORD}\"}" \
          -o ./mars/cas.mar
        echo "mars/cas.mar Downloaded."
    fi
fi
