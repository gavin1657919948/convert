FROM centos:7

RUN yum install libreoffice -y   && \
yum install libreoffice-headless -y && \
yum clean all && \
mkdir /usr/share/fonts/winfonts
COPY /fonts /usr/share/fonts/winfonts
RUN cd /usr/share/fonts/winfonts && \
mkfontscale && \
mkfontdir && \
fc-cache -fv && \
yum install epel-release -y && \
yum update -y && \
rpm --import http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro && \
rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm && \
yum install ffmpeg ffmpeg-devel -y

ADD node-v10.17.0-linux-x64.tar.xz    /usr/local
RUN mv /usr/local/node-v10.17.0-linux-x64  /usr/local/node
ENV PATH $PATH:/usr/local/node/bin
 
RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm install --registry=https://registry.npm.taobao.org && \
npm install pm2 -g --registry=https://registry.npm.taobao.org && \
rm /fonts -rf && \
rm node-v10.17.0-linux-x64.tar.xz -f

EXPOSE 80 443 31121
CMD ["pm2-docker","start","npm","--","start"]

