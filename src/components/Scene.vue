<template>
  <a-scene @mousedown='toggleFly()'>
    <a-assets>
      <audio ref='bgAudio'
             :src='bgAudio'
             autoplay></audio>
      <a-asset-item id='door'
                    :src='door'></a-asset-item>
      <a-asset-item id="zwfont"
                    :src='zwFont'></a-asset-item>
    </a-assets>
    <!--空间 整体y偏转-90度让图片与场景强名称一致-->
    <a-entity rotation='0 -90 0'>
      <a-plane v-for='(img,direction) in currentSpace.imgs'
               :key='direction'
               :id="getImgId(currentSpace,direction)"
               :src="getImgSrc(img,{w:1024})"
               :width='size'
               :height='size'
               :position="getPosition(direction)"
               :rotation="getRotation(direction)">
        <a-animation v-if='isChanging'
                     @animationend='isChanging = false'
                     direction='alternate'
                     attribute='material.color'
                     dur='500'>
        </a-animation>
      </a-plane>
    </a-entity>

    <a-entity :rotation='getAnchorRotation(anchor.x,anchor.y)'
              v-for='anchor in currentSpace.anchor'
              v-if='!isChanging'
              :key='anchor.sid'>
      <anchor :content='spaceMap[anchor.sid].space'
              @click="goNextSpace(anchor.sid)"
              @mouseenter='setAnchorSid(anchor.sid)'
              @mouseleave='unsetAnchorSid(anchor.sid)' />
    </a-entity>

    <a-camera ref='camera'
              id='room-camera'
              user-height='0'
              wasd-controls='enabled:false;'>
      <a-cursor v-if='isMultiSpaces'
                :color="isHover?'green':'white'"></a-cursor>
      <a-animation v-if='isFly'
                   attribute='rotation'
                   to='0 -360 0'
                   repeat='indefinite'
                   dur='100000'
                   easing='linear'></a-animation>
      <a-animation v-if='isChanging'
                   attribute='rotation'
                   to='0 0 0'
                   dur='100'>
      </a-animation>
      <a-animation v-if='isZooming'
                   attribute='zoom'
                   @animationend='isZooming=false'
                   :from='zoomFrom'
                   :to='zoomTo'
                   dur='300'>
      </a-animation>
    </a-camera>

    <a-light type="ambient"></a-light>

    <div class="scene-loader"
         v-show='isLoading'>

      <span class="scene-loader__txt">
        <img class="scene-loader__spin"
             src="../assets/loading.png">场景加载中{{loadingProcess}}%</span>
    </div>

    <div v-if='!isHideControl'
         class="scene-toolbar">
      <div class="space-name">
        {{currentSpace.space}}
      </div>

      <ul class="scene-spaces">
        <li @click.capture='goNextSpace(space.id)'
            :active='space.id===currentSpace.id'
            v-for='space in sceneData'>
          <img :src="getImgSrc(space.thumb,{w:256})">
          <p>{{space.space}}</p>
        </li>
      </ul>

      <ul class="scene-control">
        <li>
          <i class="iconfont icon-back"></i>
        </li>
        <li>
          <i class="iconfont icon-stop"></i>
        </li>
        <li>
          <i class="iconfont icon-more"></i>
        </li>
      </ul>
    </div>

    <div @click='toggleBgAudio'
         class="audio-control">
      <img :active='bgIsPlaying'
           src="../assets/music.png"
           alt="audio-control">
    </div>

    <div class="scene-edit"
         v-if='isEditMode'>
      <el-button v-if='isHover'
                 @click='deleteLink(currentSpace.id,currentAnchor)'
                 type='primary'>
        删除空间
      </el-button>
      <el-button v-if='isHover'
                 @click='editLink(currentSpace.id,currentAnchor)'>
        编辑 [ {{spaceMap[currentAnchor].space}} ]
      </el-button>
      <el-button v-else
                 @click="addLink(currentSpace.id)"
                 type="primary">
        添加空间
      </el-button>
      <el-button type='primary'
                 :loading='isSaving'
                 @click='saveAnchor(currentSpace)'>保存</el-button>
    </div>

    <el-dialog v-model='dialogVisible'
               title='空间关联'>
      <p>选择此处需要跳转的空间</p>
      <el-select v-model='spaceVal'
                 placeholder='请选择'>
        <el-option v-for='s in sceneData'
                   :key='s.id'
                   :label='s.space'
                   :value='s.id'
                   :disabled='s.id === currentSpace.id'></el-option>
      </el-select>
      <p slot='footer'
         class="dialog-footer">
        <el-button @click='dialogVisible = false'>取消</el-button>
        <el-button type='primary'
                   @click='confirm(spaceVal,currentSpace,isHover)'>确认</el-button>
      </p>
    </el-dialog>
  </a-scene>
</template>

<style src='./Scene.css'></style>

<script>
import { assetsLoad } from '@/plugins/utils'
import { imgViewFilter } from '@/plugins/filters'
import axios from '@/plugins/axios'
import Anchor from './Anchor.vue'

// audios
import audioCanon from '@/assets/audio/canon.aac'
import audioWedding from '@/assets/audio/wedding.mp3'

// font
import zwFont from '@/assets/zwfont.json'
import door from '@/assets/door.png'

const AUDIO_LIST = [
  audioCanon,
  audioWedding
]

const RandomAudioId = Number.parseInt(Math.random() * AUDIO_LIST.length)

// sky-box length
const BOX_SIZE = 50

const ROTATION_MAP = {
  image_left: '0 -180 0',
  image_right: '0 0 0',
  image_fornt: '0 90 0',
  image_back: '0 -90 0',
  image_up: '90 90 0',
  image_down: '-90 90 0'
}

const POSITION_MAP = {
  image_left: `0 0 ${BOX_SIZE / 2}`,
  image_right: `0 0 -${BOX_SIZE / 2}`,
  image_fornt: `-${BOX_SIZE / 2} 0 0`,
  image_back: `${BOX_SIZE / 2} 0 0`,
  image_up: `0 ${BOX_SIZE / 2} 0`,
  image_down: `0 -${BOX_SIZE / 2} 0`
}

export default {
  components: {
    Anchor
  },
  props: {
    sceneData: {
      type: Array,
      default: () => [{
        imgs: {}
      }]
    }
  },
  data () {
    return {
      size: BOX_SIZE,
      zwFont,
      door,
      isFly: true,
      isChanging: false,
      isHover: false,
      spaceMap: {},
      currentSpace: {},
      isLoading: false,
      loadingProcess: 0,
      bgAudioIndex: RandomAudioId,
      bgIsPlaying: true,
      keypress: {},
      isZooming: false,
      zoomFrom: 0.9,
      zoomTo: 1,

      isEditMode: this.$route.query.edit,

      currentAnchor: 0,
      dialogVisible: false,
      spaceVal: '',
      isSaving: false
    }
  },
  created () {
    this.initScene(this.sceneData)
    if (this.isEditMode || this.isMobile) {
      this.isFly = false
      this.$refs.bgAudio.play()
    }
  },
  mounted () {
    document.addEventListener('mousewheel', this.mousewheel, false)
    document.addEventListener('click', () => {
      if (this.isMobile && this.isHover) {
        this.goNextSpace(this.currentAnchor)
      }
    }, false)
  },
  computed: {
    bgAudio () {
      return AUDIO_LIST[this.bgAudioIndex]
    },
    isMultiSpaces () {
      return this.sceneData.length > 1
    },
    isMobile () {
      return this.$route.query.mobile
    },
    isHideControl () {
      return this.isMobile || this.$route.query.hideControl || (!this.isMultiSpaces)
    }
  },
  methods: {
    imgViewFilter,
    mousewheel (e) {
      this.toggleFly()
      let s = e.deltaY > 0 ? 0.8 : 1.2
      this.isZooming = true
      this.zoomFrom = this.zoomTo
      this.zoomTo = this.zoomFrom * s
      if (this.zoomTo < 0.8) {
        this.zoomTo = 0.8
      }
      if (this.zoomTo > 1.6) {
        this.zoomTo = 1.6
      }
    },
    toggleBgAudio () {
      const audioEl = this.$refs.bgAudio
      if (audioEl.paused) {
        audioEl.play()
        this.bgIsPlaying = true
      } else {
        audioEl.pause()
        this.bgIsPlaying = false
      }
    },
    getImgSrc (fname, opts) {
      if (this.$route.name === 'share.vr') {
        return imgViewFilter(fname, opts, 'staging')
      } else {
        return imgViewFilter(fname, opts)
      }
    },
    loadSpaceAssets (newSpace) {
      const assets = Object.keys(newSpace.imgs).map(k => this.getImgSrc(newSpace.imgs[k], { w: 1024 }))
      this.loadingProcess = 0
      return assetsLoad.init({
        assets,
        update: (process, processAll) => {
          this.loadingProcess = Math.floor(process / processAll * 100)
        }
      })
    },
    initScene (spaces) {
      // 空间对应表
      const _spaceMap = {}
      spaces.forEach(space => {
        _spaceMap[space.id] = space
      })
      this.spaceMap = _spaceMap

      const _currentSpace = spaces[0]
      this.isLoading = true

      this.loadSpaceAssets(_currentSpace)
        .then(() => {
          this.currentSpace = _currentSpace
          this.isLoading = false
          this.isChanging = true
        })
        .catch(e => {
          this.$message.error('资源加载失败')
        })
    },
    toggleFly () {
      if (this.isFly) {
        this.isFly = false
      }
    },
    getRotation (direction) {
      return ROTATION_MAP[direction]
    },
    getPosition (direction) {
      return POSITION_MAP[direction]
    },
    getImgId (space, direction) {
      return `room#${space.id}_${direction}`
    },
    setAnchorSid (sid) {
      this.isHover = true
      this.currentAnchor = sid
    },
    unsetAnchorSid (sid) {
      this.isHover = false
    },
    goNextSpace (sid) {
      if (sid === this.currentSpace.id) {
        this.isFly = true
        return
      }
      const _currentSpace = this.spaceMap[sid]
      this.isLoading = true
      this.loadSpaceAssets(_currentSpace)
        .then(() => {
          this.isLoading = false
          this.currentSpace = _currentSpace
          this.isHover = false
          this.isFly = true
          this.isChanging = true
          this.isZooming = true
          this.zoomFrom = 0.9
          this.zoomTo = 1
        })
        .catch(() => {
          this.$message.error('资源加载失败')
        })
    },
    getAnchorRotation (x, y) {
      return `${x || 0} ${y || 0} 0`
    },

    // 编辑模式方法
    addLink (sid) {
      this.dialogVisible = true
    },
    editLink (sid, currentAnchor) {
      this.dialogVisible = true
      this.spaceVal = currentAnchor
    },
    deleteLink (sid, currentAnchor) {
      const currentAnchorObj = this.currentSpace.anchor.filter(a => a.sid === currentAnchor)[0]
      const aIndex = this.currentSpace.anchor.indexOf(currentAnchorObj)
      this.currentSpace.anchor.splice(aIndex, 1)
    },
    confirm (spaceVal, currentSpace, isHover) {
      // 编辑
      if (isHover) {
        const currentAnchorObj = currentSpace.anchor.filter(a => a.sid === this.currentAnchor)[0]
        currentAnchorObj.sid = spaceVal
        this.dialogVisible = false
      }
      // 添加
      if (!isHover) {
        currentSpace.anchor.push({
          sid: spaceVal,
          x: this.$refs.camera.getAttribute('rotation').x,
          y: this.$refs.camera.getAttribute('rotation').y
        })
        this.dialogVisible = false
      }
    },
    saveAnchor (currentSpace) {
      this.isSaving = true
      axios.post(`/_bapi/spaces/${currentSpace.id}`, {
        anchor: currentSpace.anchor
      })
        .then(res => {
          this.$message.success('锚点更新成功！')
          this.isSaving = false
        })
        .catch(() => { })
    }
  },
  watch: {
    sceneData (newSpaces) {
      this.initScene(newSpaces)
    }
  }
}
</script>
