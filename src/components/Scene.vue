<template>
  <a-scene @mousedown='toggleFly()'>
    <a-assets>
      <audio :src='bgAudio'></audio>
    </a-assets>
    <!--空间 整体y偏转-90度让图片与场景强名称一致-->
    <a-entity rotation='0 -90 0'>
      <a-plane v-for='(img,direction) in currentSpace.imgs'
               :key='direction'
               :id="getImgId(currentSpace,direction)"
               :src="getImgSrc(img,'2048')"
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

    <a-entity :rotation='getAnchorRotation(anchor.y)'
              v-for='anchor in currentSpace.anchor'
              v-if='!isChanging'
              :key='anchor.sid'>
      <anchor :content='spaceMap[anchor.sid].space'
              @click.native="goNextSpace(anchor.sid)"
              @mouseenter.native='setAnchorSid(anchor.sid)'
              @mouseleave.native='isHover=false'>
        <a-animation begin='mouseenter'
                     end='mouseleave'
                     attribute='position'
                     direction='alternate'
                     to='0 0.1 -5'
                     repeat='indefinite'
                     dur='500'>
        </a-animation>
      </anchor>
    </a-entity>

    <a-camera ref='camera'
              id='room-camera'
              user-height='0'
              wasd-controls='enabled:false;'>
      <a-cursor :color="isHover?'green':'white'"></a-cursor>
      <a-animation v-if='isFly'
                   attribute='rotation'
                   to='0 -360 0'
                   repeat='indefinite'
                   dur='100000'
                   easing='linear'></a-animation>
      <a-animation v-if='isChanging'
                   attribute='rotation'
                   to='0 0 0'
                   dur='100'></a-animation>

      </a-animation>
    </a-camera>

    <a-light type="ambient"></a-light>

    <div class="scene-loader"
         v-if='isLoading'>
      <span class="scene-loader__txt">场景加载中...</span>
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
import { imgFilter } from '@/plugins/filters'
import axios from '@/plugins/axios'
import Anchor from './Anchor.vue'

// audios
import audioCanon from '@/assets/audio/canon.aac'
import audioWedding from '@/assets/audio/wedding.mp3'

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
/**
 * scene example
 *    {id:1,name:"空间1",imgs:{},links:[]},
 *    {id:1,name:"空间1",imgs:{},links:[]},
 *    {id:1,name:"空间1",imgs:{},links:[]}
 */
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
      isFly: true,
      isChanging: false,
      isHover: false,
      spaceMap: {},
      currentSpace: {},
      isLoading: false,
      bgAudioIndex: RandomAudioId,

      isEditMode: this.$route.query.edit,
      currentAnchor: 0,
      dialogVisible: false,
      spaceVal: '',
      isSaving: false
    }
  },
  created () {
    this.initScene(this.sceneData)
    if (this.isEditMode) {
      this.isFly = false
    }
  },
  computed: {
    bgAudio () {
      return AUDIO_LIST[this.bgAudioIndex]
    }
  },
  methods: {
    getImgSrc (fname, suffix) {
      return imgFilter(fname, suffix)
    },
    loadSpaceAssets (newSpace) {
      const assets = Object.keys(newSpace.imgs).map(k => this.getImgSrc(newSpace.imgs[k], '2048'))
      return assetsLoad(assets)
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
    goNextSpace (sid) {
      const _currentSpace = this.spaceMap[sid]
      const loadStart = this.$notify.info('资源加载中...')
      this.loadSpaceAssets(_currentSpace)
        .then(() => {
          loadStart.close()
          this.currentSpace = _currentSpace
          this.isFly = true
          this.isChanging = true
        })
        .catch(() => {
          this.$message.error('资源加载失败')
        })
    },
    getAnchorRotation (y) {
      return `0 ${y} 0`
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
      this.$confirm('确认删除此空间链接么？')
        .then(() => {
          const currentAnchorObj = this.currentSpace.anchor.filter(a => a.sid === currentAnchor)[0]
          const aIndex = this.currentSpace.anchor.indexOf(currentAnchorObj)
          this.currentSpace.anchor.splice(aIndex, 1)
        })
        .catch(() => { })
    },
    confirm (spaceVal, currentSpace, isHover) {
      if (isHover) {
        const currentAnchorObj = currentSpace.anchor.filter(a => a.sid === this.currentAnchor)[0]
        currentAnchorObj.sid = spaceVal
        currentAnchorObj.thumb = this.spaceMap[spaceVal].imgs.image_left
        this.dialogVisible = false
      }
      if (!isHover) {
        currentSpace.anchor.push({
          sid: spaceVal,
          y: this.$refs.camera.getAttribute('rotation').y,
          thumb: this.spaceMap[spaceVal].imgs.image_left
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
