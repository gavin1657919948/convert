From  centos:6
user root
RUN yum remove libreoffice-* && \
yum install libreoffice -y   && \
yum install libreoffice-headless -y 
RUN mkdir /usr/share/fonts/winfonts
COPY /fonts /usr/share/fonts/winfonts
RUN cd /usr/share/fonts/winfonts && \
mkfontscale && \
mkfontdir && \
fc-cache -fv
expose 31121
